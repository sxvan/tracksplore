using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tracksplore.DataAccess.Models;

[Table(nameof(ExternalLogin))]
public class ExternalLogin : Entity
{
  [Required]
  [StringLength(100)]
  public string ProviderName { get; set; }

  [Required]
  [StringLength(100)]
  public string ProviderKey { get; set; }

  public Guid UserId { get; set; }

  public User? User { get; set; }
}
