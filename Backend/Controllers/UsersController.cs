using Backend.Data;
using Backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "Admin")]
public class UsersController(AppDbContext db) : ControllerBase
{
    // TEMPORAL: AllowAnonymous para crear el primer usuario admin. Quitar después.
    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUsuarioRequestDto request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (request.Password != request.ConfirmPassword)
            return BadRequest(new { message = "Las contraseñas no coinciden." });

        bool usernameExists = await db.Usuarios
            .AnyAsync(u => u.Username == request.Username);

        if (usernameExists)
            return Conflict(new { message = "El nombre de usuario ya existe en el sistema." });

        var nuevoUsuario = new Usuario
        {
            Username = request.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Rol = request.Rol,
            Activo = true
        };

        db.Usuarios.Add(nuevoUsuario);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(CreateUser), new
        {
            id = nuevoUsuario.Id,
            username = nuevoUsuario.Username,
            rol = nuevoUsuario.Rol
        });
    }
}
