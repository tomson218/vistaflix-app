#!/usr/bin/env bash
# Verifies a running Docker Compose stack through the public frontend port.
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8080}"
API_URL="$BASE_URL/api/v1"
COOKIES="$(mktemp)"
EMAIL="smoke-$(date +%s)-$RANDOM@example.com"
PASSWORD="Smoke-Test-$RANDOM-Password"
trap 'rm -f "$COOKIES"' EXIT

expect_status() {
    local description="$1" expected="$2" actual
    shift 2
    actual="$(curl --silent --output /dev/null --write-out '%{http_code}' --cookie "$COOKIES" --cookie-jar "$COOKIES" "$@")"

    if [ "$actual" != "$expected" ]; then
        echo "FAIL: $description (expected $expected, got $actual)"
        exit 1
    fi

    echo "OK:   $description ($actual)"
}

curl --silent --output /dev/null --retry 30 --retry-delay 2 --retry-all-errors "$BASE_URL/"

expect_status 'frontend serves the app' 200 "$BASE_URL/"
expect_status 'frontend serves client-side routes' 200 "$BASE_URL/home"
expect_status 'movies require login' 401 "$API_URL/movies"
expect_status 'write requests require a CSRF token' 403 --request POST "$API_URL/auth/logout"

CSRF_TOKEN="$(curl --silent --cookie "$COOKIES" --cookie-jar "$COOKIES" "$API_URL/auth/csrf" | sed -E 's/.*"token":"([^"]+)".*/\1/')"
BODY="{\"firstName\":\"Smoke\",\"lastName\":\"Test\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"phoneNumber\":\"500600700\"}"

expect_status 'registration writes to PostgreSQL' 201 --request POST \
    --header 'Content-Type: application/json' --header "X-CSRF-Token: $CSRF_TOKEN" --data "$BODY" "$API_URL/auth/register"
expect_status 'session cookie is accepted' 200 "$API_URL/auth/me"
expect_status 'logged-in user can read movies' 200 "$API_URL/movies"
expect_status 'regular user cannot list all users' 403 "$API_URL/users"
expect_status 'session can be refreshed' 204 --request POST --header "X-CSRF-Token: $CSRF_TOKEN" "$API_URL/auth/refresh"
expect_status 'logout succeeds' 204 --request POST --header "X-CSRF-Token: $CSRF_TOKEN" "$API_URL/auth/logout"
expect_status 'session ends after logout' 401 "$API_URL/auth/me"

echo 'Smoke test passed.'
