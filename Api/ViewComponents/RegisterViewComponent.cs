using Microsoft.AspNetCore.Mvc;

namespace Api.ViewComponents
{
    public class RegisterViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View();
        }
    }
}
