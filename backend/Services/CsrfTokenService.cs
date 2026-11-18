using System.Security.Cryptography;
using System.Text;

namespace backend.Services
{
    public class CsrfTokenService(IConfiguration config)
    {
        private readonly byte[] signingKey = Encoding.UTF8.GetBytes(config["CsrfSigningKey"]!);

        public string Create()
        {
            var value = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
            return $"{value}.{Sign(value)}";
        }

        public bool IsAuthentic(string? token)
        {
            var parts = token?.Split('.');
            return parts is { Length: 2 } && FixedTimeEquals(parts[1], Sign(parts[0]));
        }

        public bool Matches(string? cookieToken, string? headerToken) =>
            IsAuthentic(cookieToken) && headerToken is not null && FixedTimeEquals(cookieToken!, headerToken);

        private string Sign(string value) =>
            Convert.ToHexString(HMACSHA256.HashData(signingKey, Encoding.UTF8.GetBytes(value)));

        private static bool FixedTimeEquals(string left, string right) =>
            CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(left), Encoding.UTF8.GetBytes(right));
    }
}
