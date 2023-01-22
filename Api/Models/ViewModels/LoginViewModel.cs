using System.ComponentModel.DataAnnotations;

namespace Api.Models.ViewModels
{
    public class LoginViewModel
    {
        [MaxLength(250, ErrorMessage = "حداکثر تعداد کاراکتر برای نام کاربری 250 است")]
        [Required(ErrorMessage = "لطفا نام کاربری را وارد کنید")]
        public string lUserName { get; set; }


        [MaxLength(250, ErrorMessage = "حداکثر تعداد کاراکتر برای کلمه ی عبور 250 است")]
        [Required(ErrorMessage = "لطفا کلمه ی عبور را وارد کنید")]
        public string lPassword { get; set; }

        public bool lRememberMe { get; set; }

        public bool IsLockOut { get; set; }

        public bool IsNotAllowed { get; set; }
    }
}
