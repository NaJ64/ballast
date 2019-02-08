using System;

namespace Ballast.Core.Application.Models
{
    public class ChatMessage
    {
        public Guid GameId { get; set; }
        public string Channel { get; set; }
        public Guid FromPlayerId { get; set; }
        public string FromPlayerName { get; set; }
        public string Text { get; set; }
        public string SentOnDateIsoString { get; set; }
    }
}