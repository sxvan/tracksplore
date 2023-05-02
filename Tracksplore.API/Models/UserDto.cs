using Tracksplore.DataAccess.Enums;
using Tracksplore.DataAccess.Models;

namespace Tracksplore.API.Models;

public class UserDto
{
  public string DisplayName { get; set; }

  public string Email { get; set; }

  public DateTime BirthDate { get; set; }

  public Gender Gender { get; set; }

  public static UserDto FromUser(User user)
  {
    return new UserDto()
    {
      DisplayName = user.DisplayName,
      Email = user.Email,
      BirthDate = user.BirthDate,
      Gender = user.Gender,
    };
  }
}
