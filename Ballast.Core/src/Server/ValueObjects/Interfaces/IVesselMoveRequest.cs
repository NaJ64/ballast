using System;

namespace Ballast.Core.ValueObjects.Interfaces
{
    public interface IVesselMoveRequest
    {
        Guid GameId { get; }
        Guid BoardId { get; }
        Guid VesselId { get; }
        string TimestampText { get; }
        int[] SourceOrderedTriple { get; }
        int[] TargetOrderedTriple { get; }
    }
}