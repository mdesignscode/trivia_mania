import { Skeleton } from "@mui/material";

interface LoadingProps {
  length: number;
  width?: number;
}

export default function Loading({ length, width }: LoadingProps) {
  const loadingList = Array.from({ length });

  return (
    <div
      className="m-auto w-2/3 flex gap-2 flex-wrap justify-center"
      data-testid="loading-skeleton-container"
    >
      {loadingList.map((_, i) => {
        return (
          <Skeleton
            data-testid="loading-skeleton"
            key={`loader_${i}`}
            variant="rectangular"
            width={width || 60}
            height={40}
            sx={{ bgcolor: "#ffcb74", borderRadius: 2 }}
          />
        );
      })}
    </div>
  );
}
