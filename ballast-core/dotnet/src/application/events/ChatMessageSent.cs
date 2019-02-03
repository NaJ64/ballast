using Ballast.Core.Messaging;
using Ballast.Core.Application.Models;

namespace Ballast.Core.Application.Events
{
    public class ChatMessageSentEvent : EventBase
    {

        public override string Id => nameof(ChatMessageSentEvent);

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