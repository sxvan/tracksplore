using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BCrypt.Net;

namespace Tracksplore.Common.Services;

public static class HashService
{
  public static string GetBcrypt(string value)
  {
    return BCrypt.Net.BCrypt.HashPassword(value);
  }

  public static bool VerifyBcrypt(string value, string hash)
  {
    return BCrypt.Net.BCrypt.Verify(value, hash);
  }
}
