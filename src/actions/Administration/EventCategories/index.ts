export type {
    EventCategoryInterface,
    EventCategoryUniqueInterface,
} from '@/types/Administration/EventCategories/EventCategoriesInterface';

export { createEventCategory, deleteEventCategory, updateEventCategory } from './mutations';
export {
    getAllEventCategories,
    getEventCategoriesForSelect,
    getEventCategoryById,
} from './queries';
