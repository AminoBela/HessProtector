import { ApiService } from "./apiClient";

export interface GoalItem {
    id?: number;
    label: string;
    target: number;
    saved: number;
    deadline: string;
    priority: string;
}

export const GoalsService = {
    add: async (goal: GoalItem, token: string) => {
        return ApiService.post('/goals', goal, token);
    },

    delete: async (id: number, token: string) => {
        return ApiService.delete(`/goals/${id}`, token);
    }
};
