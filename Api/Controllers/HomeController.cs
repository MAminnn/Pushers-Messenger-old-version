using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    public class HomeController : Controller
    {
        public FileInfo[] brazzershouseStickers;
        public FileInfo[] dogbynikarStickers;
        public FileInfo[] otherStickers;
        public FileInfo[] ratingstyleStickers;
        public string brazzershouseStickersPath = Directory.GetCurrentDirectory() + "\\wwwroot\\stickers\\brazzershouse\\";
        public string dogbynikarStickersPath = Directory.GetCurrentDirectory() + "\\wwwroot\\stickers\\dogbynikar\\";
        public string ratingstyleStickersPath = Directory.GetCurrentDirectory() + "\\wwwroot\\stickers\\ratingstyle\\";
        public string otherStickersPath = Directory.GetCurrentDirectory() + "\\wwwroot\\stickers\\other\\";

        public IActionResult Index()
        {
            return View();
        }

        [Authorize]
        public IActionResult ChatRoom()
        {
            ViewBag.brazzershouseStickers = this.brazzershouseStickers = new FileInfo(this.brazzershouseStickersPath).Directory.GetFiles();
            ViewBag.dogbynikarStickers = this.dogbynikarStickers = new FileInfo(this.dogbynikarStickersPath).Directory.GetFiles();
            ViewBag.ratingstyleStickers = this.ratingstyleStickers = new FileInfo(this.ratingstyleStickersPath).Directory.GetFiles();
            ViewBag.otherStickers = this.otherStickers = new FileInfo(this.otherStickersPath).Directory.GetFiles();
            return View();
        }

    }
}
