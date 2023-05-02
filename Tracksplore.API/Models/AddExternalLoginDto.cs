namespace Tracksplore.API.Models;

public class AddExternalLoginDto
{
  public string ProviderName { get; set; }

  public string ProviderKey { get; set; }

  public Guid UserId { get; set; }
}
