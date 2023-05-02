using Tracksplore.DataAccess.Enums;

namespace Tracksplore.API.Models;

public class AddUserDto
{
  public string DisplayName { get; set; }

  public string Email { get; set; }

  public string Password { get; set; }

  public DateTime BirthDate { get; set; }

  public Gender Gender { get; set; }

  public string? SpotifyId { get; set; }
}
