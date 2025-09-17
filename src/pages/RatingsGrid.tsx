import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Rating {
  _id: string;
  username: string;
  rating: number;
  description: string;
  month: string;
  year: string;
}

interface RatingsGridProps {
  ratings: Rating[];
}

const RatingsGrid: React.FC<RatingsGridProps> = ({ ratings }) => {
  const [showAll, setShowAll] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);

  const toggleReadMore = (id: string) => {
    setExpandedReviews((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const reviewsToShow = showAll ? ratings : ratings.slice(0, 4);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reviewsToShow.map((r) => (
          <Card key={r._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="font-semibold">{r.username}</span>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < r.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                {r.month} {r.year}
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {expandedReviews.includes(r._id)
                  ? r.description
                  : r.description.length > 200
                  ? r.description.slice(0, 200) + "..."
                  : r.description}
                {r.description.length > 200 && (
                  <button
                    className="ml-1 text-blue-500 hover:underline"
                    onClick={() => toggleReadMore(r._id)}
                  >
                    {expandedReviews.includes(r._id) ? "Read Less" : "Read More"}
                  </button>
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {ratings.length > 4 && (
        <div className="mt-4 text-center">
          <Button
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "View Less" : "View All Reviews"}
          </Button>
        </div>
      )}
    </>
  );
};

export default RatingsGrid;
