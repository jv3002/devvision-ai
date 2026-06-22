export const generateRefactorRoadmap = ({
  priorityRefactors = []
}) => {

  if (!priorityRefactors.length) {
    return [];
  }

  const sprint1 = priorityRefactors.slice(0, 2);
  const sprint2 = priorityRefactors.slice(2, 5);

  const roadmap = [];

  if (sprint1.length) {
    roadmap.push({
      phase: "Sprint 1",
      estimatedGain: sprint1.reduce(
        (sum, item) => sum + item.estimatedScoreGain,
        0
      ),
      tasks: sprint1.map(item => ({
        file: item.file,
        impact: item.impact
      }))
    });
  }

  if (sprint2.length) {
    roadmap.push({
      phase: "Sprint 2",
      estimatedGain: sprint2.reduce(
        (sum, item) => sum + item.estimatedScoreGain,
        0
      ),
      tasks: sprint2.map(item => ({
        file: item.file,
        impact: item.impact
      }))
    });
  }

  return roadmap;
};