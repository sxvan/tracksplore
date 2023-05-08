namespace Tracksplore.API.Models
{
  public class AuthenticateDto
    { 
        public string Token { get; set; }

        public UserDto User { get; set; }
  }
}
