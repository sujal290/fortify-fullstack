'use client';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ReviewCard from './ReviewCard';
import Button from '@/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { fetchProductReviews, createReview } from '@/services/reviewService';

function ReviewForm({ productId }) {
  const { register, handleSubmit, reset } = useForm({ defaultValues: { rating: 5 } });
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: (data) => createReview(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      showToast('Review posted — thank you');
      reset({ rating: 5, comment: '' });
    },
    onError: (err) => showToast(err?.response?.data?.message || 'Could not post review', 'error'),
  });

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate({ ...data, rating: Number(data.rating) }))} className="bg-white border border-[#eee] p-6 mb-8">
      <h4 className="font-display text-lg mb-3">Write a Review</h4>
      <div className="flex items-center gap-3 mb-3">
        <label className="text-[11px] uppercase tracking-[0.08em] text-navy font-semibold">Rating</label>
        <select {...register('rating')} className="border border-[#ddd] px-2 py-1.5 text-sm">
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? 's' : ''}</option>)}
        </select>
      </div>
      <textarea
        rows={3}
        placeholder="Share your experience with this product…"
        required
        className="w-full px-3.5 py-2.5 text-[13.5px] bg-[#fbfbfa] border border-[#ddd] outline-none focus:border-gold mb-3"
        {...register('comment', { required: true })}
      />
      <Button type="submit" variant="dark" size="sm" loading={mutation.isPending}>Post Review</Button>
    </form>
  );
}

export default function ReviewSection({ productId }) {
  const { isAuthenticated } = useAuth();
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => fetchProductReviews(productId),
  });

  return (
    <div>
      <h3 className="font-display text-2xl mb-5">Customer Reviews</h3>
      {isAuthenticated ? (
        <ReviewForm productId={productId} />
      ) : (
        <p className="text-muted text-[13px] mb-8">Sign in to leave a review.</p>
      )}
      {!isLoading && reviews?.length === 0 && <p className="text-muted text-[13px]">No reviews yet — be the first.</p>}
      <div className="grid md:grid-cols-2 gap-4">
        {reviews?.map((r) => (
          <ReviewCard key={r._id} name={r.userName} rating={r.rating} text={r.comment} date={new Date(r.createdAt).toLocaleDateString('en-IN')} />
        ))}
      </div>
    </div>
  );
}
