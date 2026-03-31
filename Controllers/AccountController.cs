using Microsoft.AspNetCore.Mvc;

namespace CAFE_DELIGHT.Controllers
{
    public class AccountController : Controller
    {
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(string email, string password)
        {
            // Here you would normally validate the user against a database.
            // For this simple example we just redirect to Home if model state is valid.
            if (!ModelState.IsValid)
            {
                return View();
            }

            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Register(string fullName, string email, string phone, string password, string confirmPassword)
        {
            // Very simple server-side check to mirror client behaviour
            if (password != confirmPassword)
            {
                ModelState.AddModelError("ConfirmPassword", "Passwords do not match.");
            }

            if (!ModelState.IsValid)
            {
                return View();
            }

            // Normally you would save the user to the database here.
            return RedirectToAction("Login");
        }

        [HttpGet]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        public IActionResult ForgotPassword(string email)
        {
            // In a real app you would send a reset email here.
            return RedirectToAction("CheckEmail");
        }

        [HttpGet]
        public IActionResult CheckEmail()
        {
            return View();
        }
    }
}

