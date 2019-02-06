namespace Ballast.Core.Application.Models
{
    public class ChatMessage
    {
        public string GameId { get; set; }
        public string Channel { get; set; }
        public string FromPlayerId { get; set; }
        public string FromPlayerName { get; set; }
        public string Text { get; set; }
        public string SentOnDateIsoString { get; set; }
    }
}