export function askBunkPlanner(question, attendance) {
  const subj = attendance?.find(a => question.toLowerCase().includes(a.name.toLowerCase())) || attendance?.[0];
  if(!subj) return "Attendance data not found";
  if(subj.percentage < 75) return `⚠️ Bunk koro na! ${subj.name} e ${subj.percentage}% - 75% er niche.`;
  return `✅ Bunk korte paro ${subj.name}, ${subj.percentage}% safe.`;
}