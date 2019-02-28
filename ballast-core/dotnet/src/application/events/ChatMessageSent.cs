using Ballast.Core.Application.Models;
using Ballast.Core.Messaging;

namespace Ballast.Core.Application.Events
{
    public class ChatMessageSentEvent : EventBase, IApplicationEvent
    {

        public static string GetId() => nameof(ChatMessageSentEvent);
        public override string Id => GetId();

        public ChatMessage Message { get; private set; }

        private ChatMessageSentEvent() { } // For model binding / deserialization
        private ChatMessageSentEvent(string eventDateIsoString, ChatMessage message) : base(eventDateIsoString)
        {
            Message = message;
        }

        public static ChatMessageSentEvent FromMessage(ChatMessage chatMessage) =>
            new ChatMessageSentEvent(EventBase.GetDateIsoString(), chatMessage);

    }
}