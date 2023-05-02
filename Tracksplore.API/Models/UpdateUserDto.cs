using Tracksplore.DataAccess.Enums;

namespace Tracksplore.API.Models;

public class UpdateUserDto
{
  public Guid Id { get; set; }

  public string DisplayName { get; set; }

  public DateTime BirthDate { get; set; }

  public Gender Gender { get; set; }
}
