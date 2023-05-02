using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tracksplore.API.Extensions;
using Tracksplore.API.Models;
using Tracksplore.DataAccess.Models;
using Tracksplore.DataAccess.Services;

namespace Tracksplore.API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class SwipeController : ControllerBase
  {
    private readonly SwipeService swipeService;

    public SwipeController(SwipeService swipeService)
    {
      this.swipeService = swipeService;
    }

    [HttpPost]
    public IActionResult Add(AddSwipeDto dto)
    {
      if (!ModelState.IsValid)
      {
        return ValidationProblem(ModelState);
      }

      Swipe? swipe = this.swipeService.GetByUserIdAndSpotifyTrackId(this.GetCurrentUserId(), dto.SpotifyTrackId);
      if (swipe != null)
      {
        return BadRequest();
      }

      swipe = this.swipeService.Create();
      swipe.UserId = this.GetCurrentUserId();
      swipe.SpotifyTrackId = dto.SpotifyTrackId;
      swipe.Result = dto.Result;

      this.swipeService.Add(swipe);

      return CreatedAtAction(nameof(this.Add), swipe);
    }
  }
}
