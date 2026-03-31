using Microsoft.AspNetCore.Mvc;

namespace CAFE_DELIGHT.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Dashboard()
        {
            return View();
        }

        public IActionResult Index()
        {
            return View();
        }

        /// <summary>UI only – add product form (no save logic yet).</summary>
        public IActionResult AddProduct()
        {
            return View();
        }

        public IActionResult Users()
        {
            return View();
        }

        public IActionResult AddUser()
        {
            return View();
        }

        public IActionResult Orders()
        {
            return View();
        }

        public IActionResult Settings()
        {
            return View();
        }
    }
}

