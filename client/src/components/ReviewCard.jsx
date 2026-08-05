export default function ReviewCard({ name, rating = 5, text, date }) {
  return (
    <div className="bg-white border border-[#eee] p-6">
      <div className="text-gold text-sm mb-2">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</div>
      <p className="text-[13.5px] text-ink/80 leading-relaxed mb-4">{text}</p>
      <div className="text-[12px] text-muted">
        <span className="font-semibold text-navy">{name}</span> · {date}
      </div>
    </div>
  );
}
