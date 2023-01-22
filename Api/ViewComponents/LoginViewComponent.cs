using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Api.ViewComponents
{
    public class LoginViewComponent : ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync()
        {
            return await Task.Run(()=> {
                return View();
            });
        }
    }
}
