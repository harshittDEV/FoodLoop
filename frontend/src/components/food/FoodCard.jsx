import { Link } from 'react-router-dom';
import { Clock, MapPin, Users } from 'lucide-react';
import Badge from '../common/Badge';
import StatusBadge from '../common/StatusBadge';
import { timeUntil, truncate } from '../../utils/helpers';
import { ROLE_LABELS } from '../../utils/constants';

export default function FoodCard({ listing }) {
  const {
    id, title, description, donorName, donorType, category,
    quantity, price, isFree, bestBefore, pickupAddress,
    dietaryTags, status,
  } = listing;

  return (
    <Link to={`/food/${id}`} className="card block group">
      {/* Header with category and status */}
      <div className="flex items-start justify-between mb-3">
        <Badge variant="gray">{category}</Badge>
        <StatusBadge status={status} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-green-deep mb-1 group-hover:text-green-primary transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-warm-gray mb-4 leading-relaxed">
        {truncate(description, 120)}
      </p>

      {/* Price / Free badge */}
      <div className="mb-4">
        {isFree ? (
          <span className="text-lg font-bold text-green-primary">Free</span>
        ) : (
          <span className="text-lg font-bold text-terracotta">₹{price}</span>
        )}
        <span className="text-sm text-warm-gray ml-2">· {quantity}</span>
      </div>

      {/* Meta info */}
      <div className="space-y-2 text-sm text-warm-gray">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-green-muted flex-shrink-0" />
          <span>{donorName} · {ROLE_LABELS[donorType]}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-green-muted flex-shrink-0" />
          <span className="truncate">{pickupAddress}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-green-muted flex-shrink-0" />
          <span>{timeUntil(bestBefore)}</span>
        </div>
      </div>

      {/* Dietary tags */}
      {dietaryTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-green-pale">
          {dietaryTags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-green-pale/60 text-green-deep">
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
