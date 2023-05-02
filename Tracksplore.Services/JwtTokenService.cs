using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Tracksplore.Common.Services;

public static class JwtTokenService
{
  public static string GenerateToken(
    byte[] secret,
    string issuer,
    int expireMinutes,
    string audience,
    string name,
    string sid)
  {
    var tokenHandler = new JwtSecurityTokenHandler();
    var key = new SymmetricSecurityKey(secret);
    var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
    var tokenDescriptor = new SecurityTokenDescriptor()
    {
      Issuer = issuer,
      Expires = DateTime.UtcNow.AddMinutes(expireMinutes),
      Audience = audience,
      SigningCredentials = signingCredentials,
      Subject = new ClaimsIdentity(new Claim[] {
        new Claim(ClaimTypes.Name, name) ,
        new Claim(ClaimTypes.Sid, sid)
      })
    };

    SecurityToken securityToken = tokenHandler.CreateToken(tokenDescriptor);
    return tokenHandler.WriteToken(securityToken);
  }
}
