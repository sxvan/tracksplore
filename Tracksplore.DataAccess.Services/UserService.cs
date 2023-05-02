using Tracksplore.DataAccess.Models;

namespace Tracksplore.DataAccess.Services;

public class UserService : Service<User>
{
  public UserService(Repository<User> repository)
    : base(repository)
  {
  }

  public User? GetByEmail(string email)
  {
    return this.Query().SingleOrDefault(u => u.Email == email);
  }

  public User? GetByDisplayName(string displayName)
  {
    return this.Query().SingleOrDefault(u => u.DisplayName == displayName);
  }
}
