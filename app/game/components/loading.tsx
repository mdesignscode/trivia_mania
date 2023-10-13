/* Loading skeleton for Question */
import { Skeleton } from "@mui/material";

export default function Loading() {
  return (
    <div
      className="m-auto w-1/2 col gap-8 border-2 border-accent rounded-lg p-5"
      data-testid="question-skeleton-container"
    >
      {/* category and difficulty */}
      <div className="flex justify-between w-full">
        <Skeleton
          variant="rectangular"
          height={20}
          sx={{ bgcolor: "#ffcb74", borderRadius: 2, width: "40%" }}
        />
        <Skeleton
          variant="rectangular"
          height={20}
          sx={{ bgcolor: "#ffcb74", borderRadius: 2, width: "20%" }}
        />
      </div>

      {/* question */}
      <Skeleton
        variant="rectangular"
        height={20}
        sx={{ bgcolor: "#ffcb74", borderRadius: 2, width: "70%" }}
      />

      {/* answers */}
      <div className="w-full grid grid-cols-2 grid-rows-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => {
          return (
            <Skeleton
              key={`skeleton_${i}`}
              variant="rectangular"
              height={40}
              sx={{ bgcolor: "#ffcb74", borderRadius: 2 }}
            />
          );
        })}
      </div>

      {/* next question button */}
      <Skeleton
        variant="rectangular"
        height={40}
        sx={{ bgcolor: "#ffcb74", borderRadius: 2, width: "100%" }}
      />
    </div>
  );
}
