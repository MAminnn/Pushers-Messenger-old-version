using Api.Models.ViewModels;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Hubs
{
    public class chatHub : Hub
    {
        private static List<ContactViewModel> connectionIds = new List<ContactViewModel>();
        public chatHub()
        {

        }

        #region public chats methods
        public async Task SendMessage(string name, string message) => await this.Clients.All.SendAsync("ReceiveMessage", name, message);

        public async Task SendSticker(string stickergroup, string stickername, string name) => await this.Clients.All.SendAsync("ReceiveSticker", stickergroup, stickername, name);

        public async Task SnedReplyMessage(string name, string message, string authorReplyMessage, string replyMessage)
        {
            await this.Clients.All.SendAsync("ReceiveReplyMessage", name, message, authorReplyMessage, replyMessage);
        }

        public async Task SnedReplySticker(
          string stickergroup,
          string stickername,
          string name,
          string authorReplyMessage,
          string replyMessage)
        {
            await this.Clients.All.SendAsync("ReceiveReplySticker", stickergroup, stickername, name, authorReplyMessage, replyMessage);
        }

        public async Task SnedReplyMessageToSticker(string stickerUri, string name, string message, string authorReplyMessage)
        {
            await this.Clients.All.SendAsync("ReceiveReplyMessageToSticker", stickerUri, name, message, authorReplyMessage);
        }
        #endregion

        #region pv chats methods
        public async Task SendMessage_pv(string connectionId, string name, string message)
        {
            await Clients.Clients(connectionId, Context.ConnectionId).SendAsync("ReceiveMessage", name, message, Context.ConnectionId);
        }

        public async Task SnedReplyMessage_pv(string connectionId, string name, string message, string authorReplyMessage, string replyMessage)
        {
            await Clients.Clients(connectionId, Context.ConnectionId).SendAsync("ReceiveReplyMessage", name, message, authorReplyMessage, replyMessage, Context.ConnectionId);
        }

        public async Task SnedSticker_pv(string connectionId, string stickergroup, string stickername, string name)
        {
            await Clients.Clients(connectionId, Context.ConnectionId).SendAsync("ReceiveSticker", stickergroup, stickername, name, Context.ConnectionId);
        }

        public async Task SnedReplyMessageToSticker_pv(string connectionId, string stickerUri, string name, string message, string authorReplyMessage, string replyMessage)
        {

            await Clients.Clients(Context.ConnectionId, connectionId).SendAsync("ReceiveReplyMessageToSticker", stickerUri, name, message, authorReplyMessage, replyMessage, Context.ConnectionId);
        }
        #endregion

        #region manage users status
        public async Task ConnectedUser(string UserName)
        {
            connectionIds.Add(new ContactViewModel() { ConnectionId = Context.ConnectionId, UserName = UserName });
            await this.Clients.All.SendAsync("UserConnected", connectionIds.ToArray());
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            connectionIds.Remove(connectionIds.SingleOrDefault(u => u.ConnectionId == Context.ConnectionId));
            this.Clients.All.SendAsync("UserDisconnected", connectionIds.ToArray());
            return base.OnDisconnectedAsync(exception);
        }
        #endregion
    }
}
