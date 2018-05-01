using Ballast.Core.Models.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Ballast.Core.Models
{
    public class BoardType : StaticListTypeBase<BoardType>, IBoardType
    {

        public static BoardType Rectangle = new BoardType(value: 0, name: "Rectangle", centerOrigin: false);
        public static BoardType RegularPolygon = new BoardType(value: 1, name: "RegularPolygon", centerOrigin: true);

        public bool CenterOrigin { get; private set; }

        private BoardType(int value, string name, bool centerOrigin) : base(value, name)
        {
            CenterOrigin = centerOrigin;
        }

        private BoardType(IBoardType state) : this(
            value: state.Value, 
            name: state.Name, 
            centerOrigin: state.CenterOrigin
        ) { }
        
        public static IEnumerable<BoardType> List() => new[] {
            BoardType.Rectangle,
            BoardType.RegularPolygon
        };

        public static BoardType FromObject(IBoardType state) =>
            new BoardType(state);

        public static BoardType FromValue(int value) =>
            BoardType.List().Single(x => x.Value == value);

        public static BoardType FromString(string name) =>
            BoardType.List().Single(x => x.Name.ToLowerInvariant() == name.ToLowerInvariant());

    }
}