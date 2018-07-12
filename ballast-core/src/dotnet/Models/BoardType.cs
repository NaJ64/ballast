using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Models
{

    public class BoardTypeState : StaticListTypeStateBase
    {
        public bool CenterOrigin { get; set; }
    }

    public class BoardType : StaticListTypeBase<BoardType>
    {

        public readonly static BoardType Rectangle = new BoardType(value: 0, name: nameof(Rectangle), centerOrigin: false);
        public readonly static BoardType RegularPolygon = new BoardType(value: 1, name: nameof(RegularPolygon), centerOrigin: true);

        public bool CenterOrigin { get; private set; }

        private BoardType(int value, string name, bool centerOrigin) : base(value, name)
        {
            CenterOrigin = centerOrigin;
        }

        public static IEnumerable<BoardType> List() => new[] {
            BoardType.Rectangle,
            BoardType.RegularPolygon
        };

        public static BoardType FromValue(int value) =>
            BoardType.List().Single(x => x.Value == value);

        public static BoardType FromString(string name) =>
            BoardType.List().Single(x => x.Name.ToLowerInvariant() == name.ToLowerInvariant());
            
        public static implicit operator BoardType(BoardTypeState state) =>
            BoardType.FromValue(state.Value);

    }
    
}