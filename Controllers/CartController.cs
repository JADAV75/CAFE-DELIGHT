using Microsoft.AspNetCore.Mvc;

namespace CAFE_DELIGHT.Controllers
{
    public class CartController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Checkout()
        {
            return View();
        }

        public IActionResult OrderSuccess()
        {
            return View();
        }
    }
}

