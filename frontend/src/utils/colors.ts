export const subjectColors = [
  { name: 'indigo', value: '#4F46E5', bg: '#EEF2FF' },
  { name: 'emerald', value: '#10B981', bg: '#ECFDF5' },
  { name: 'rose', value: '#E11D48', bg: '#FFF1F2' },
  { name: 'amber', value: '#F59E0B', bg: '#FFFBEB' },
  { name: 'blue', value: '#3B82F6', bg: '#EFF6FF' },
  { name: 'purple', value: '#8B5CF6', bg: '#F5F3FF' },
  { name: 'cyan', value: '#06B6D4', bg: '#ECFEFF' },
  { name: 'pink', value: '#EC4899', bg: '#FDF2F8' },
];

export const getRandomColor = () => {
  return subjectColors[Math.floor(Math.random() * subjectColors.length)];
};

export const difficultyColors = {
  easy: { text: 'text-emerald-600', bg: 'bg-emerald-100' },
  medium: { text: 'text-amber-600', bg: 'bg-amber-100' },
  hard: { text: 'text-rose-600', bg: 'bg-rose-100' },
};