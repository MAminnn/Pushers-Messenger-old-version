using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models.ViewModels
{
    public class RegisterViewModel
    {
        [Remote("IsUserNameIsInUse", "Account")]
        [Required(ErrorMessage = "لطفا {0} را وارد نمایید")]
        [MaxLength(250, ErrorMessage = "حداکثر تعداد کاراکتر 250 است")]
        [RegularExpression("^[A-Za-z0-9]*$", ErrorMessage ="نام کاربری باید فقط شامل عدد و حروف انگلیسی باشد ")]
        [Display(Name = "نام کاربری")]
        public string rUserName { get; set; }


        [MaxLength(250, ErrorMessage = "حداکثر تعداد کاراکتر 250 است")]
        [Display(Name = "کلمه ی عبور")]
        [DataType(DataType.Password)]
        [Required(ErrorMessage = "لطفا {0} را وارد نمایید")]
        [RegularExpression(pattern: "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#%^&])[A-Za-z0-9@#%^&]{6,}", ErrorMessage = "رمز عبور باید حداقل دارای 6 کاراکتر و حداقل یک حروف کوچک و بزرگ انگلیسی و یک کاراکتر خاص (@#%^&) باشد")]
        public string rPassword { get; set; }


        [MaxLength(250, ErrorMessage = "حداکثر تعداد کاراکتر 250 است")]
        [Display(Name = "تکرار کلمه ی عبور ")]
        [DataType(DataType.Password)]
        [Required(ErrorMessage = "لطفا {0} را وارد نمایید")]
        [Compare(nameof(rPassword), ErrorMessage = "تکرار کلمه ی عبور با کلمه ی عبور مطابقت ندارد")]
        public string ConfirmPassword { get; set; }


        [MaxLength(250, ErrorMessage = "حداکثر تعداد کاراکتر 250 است")]
        [Display(Name = "ایمیل")]
        [DataType(DataType.EmailAddress, ErrorMessage = "ایمیل وارد شده معتبر نیست ")]
        [Required(ErrorMessage = "لطفا {0} را وارد نمایید")]
        [Remote("IsEmailInUse", "Account")]
        public string rEmail { get; set; }
    }
}
