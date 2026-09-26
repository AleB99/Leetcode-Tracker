function DashboardPage({ entries, on }) {
  const { useMemo } = React;

  // computes derived statistics from entries and memoizes
  // them with useMemo so they are recalculated only when entries changes
  const stats = useMemo(() => ({ total: entries.length }), [entries]);

  // Count how many entries have each user rating from 1 to 10
  const ratingCounts = useMemo(() => {
    const counts = Array(10).fill(0);
    entries.forEach((e) => {
      counts[e.userRating - 1]++;
    });
    return counts;
  }, [entries]);

  // Count entries for each official difficulty in the desired display order
  const difficultyCounts = useMemo(() => {
    const order = ["Easy", "Medium", "Hard"];
    return order.map((d) => ({
      d,
      n: entries.filter((e) => e.officialDifficulty === d).length,
    }));
  }, [entries]);

  // Keep due entries ordered by the date they should be reviewed next
  const reviewQueue = useMemo(
    () =>
      entries
        .filter(isDue)
        .sort(
          (a, b) => new Date(a.nextReviewDate) - new Date(b.nextReviewDate),
        ),
    [entries],
  );

  const upcomingReviews = useMemo(
    () =>
      entries
        .filter((e) => new Date(e.nextReviewDate).getTime() > Date.now())
        .sort((a, b) => new Date(a.nextReviewDate) - new Date(b.nextReviewDate))
        .slice(0, 3),
    [entries],
  );
  const displayedReviews =
    reviewQueue.length > 0 ? reviewQueue : upcomingReviews;
}
