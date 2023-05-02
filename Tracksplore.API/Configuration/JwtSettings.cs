namespace Tracksplore.API.Configuration;

public class JwtSettings
{
  public string Issuer { get; set; }

  public string Audience { get; set; }

  public string Secret { get; set; }

  public int ExpireMinutes { get; set; }
}
