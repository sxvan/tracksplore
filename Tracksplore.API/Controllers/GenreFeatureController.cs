using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tracksplore.API.Extensions;
using Tracksplore.API.Models;
using Tracksplore.DataAccess.Models;
using Tracksplore.DataAccess.Services;

namespace Tracksplore.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GenreFeatureController : ControllerBase
{
  private readonly GenreFeatureService genreFeatureService;
  private readonly MusicTasteService musicTasteService;

  public GenreFeatureController(GenreFeatureService genreFeatureService, MusicTasteService musicTasteService)
  {
    this.genreFeatureService = genreFeatureService;
    this.musicTasteService = musicTasteService;
  }

  [HttpPost]
  public IActionResult Add(AddGenreFeatureDto dto)
  {
    MusicTaste? musicTaste = this.musicTasteService.Get(dto.MusicTasteId);
    if (musicTaste == null)
    {
      return NotFound();
    }

    if (musicTaste.UserId == this.GetCurrentUserId())
    {
      return Unauthorized();
    }

    if (!ModelState.IsValid)
    {
      return ValidationProblem(ModelState);
    }

    GenreFeature genreFeature = this.genreFeatureService.Create();
    genreFeature.MusicTasteId = dto.MusicTasteId;
    genreFeature.Genre = dto.Genre;
    genreFeature.Percentage = dto.Percentage;

    this.genreFeatureService.Add(genreFeature);

    return CreatedAtAction(nameof(this.Add), genreFeature);
  }

  [HttpPut]
  public IActionResult Update(UpdateGenreFeatureDto dto)
  {
    GenreFeature? genreFeature = this.genreFeatureService.Get(dto.Id);
    if (genreFeature == null)
    {
      return NotFound();
    }

    MusicTaste? musicTaste = this.musicTasteService.Get(genreFeature.MusicTasteId);
    if (musicTaste == null)
    {
      return NotFound();
    }

    if (musicTaste.UserId != this.GetCurrentUserId())
    {
      return Unauthorized();
    }

    if (!ModelState.IsValid)
    {
      return ValidationProblem(ModelState);
    }

    genreFeature.Genre = dto.Genre;
    genreFeature.Percentage = dto.Percentage;

    this.genreFeatureService.Update(genreFeature);

    return Ok(genreFeature);
  }

  [HttpDelete]
  public IActionResult Delete(Guid id)
  {
    GenreFeature? genreFeature = this.genreFeatureService.Get(id);
    if (genreFeature == null)
    {
      return NotFound();
    }

    MusicTaste? musicTaste = this.musicTasteService.Get(genreFeature.MusicTasteId);
    if (musicTaste == null)
    {
      return NotFound();
    }

    if (musicTaste.UserId != this.GetCurrentUserId())
    {
      return Unauthorized();
    }

    if (!this.genreFeatureService.Delete(id))
    {
      return BadRequest();
    }

    return Ok();
  }
}
