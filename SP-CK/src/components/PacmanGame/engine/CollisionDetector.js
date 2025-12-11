// src/games/PacMan/engine/CollisionDetector.js

export class CollisionDetector {
    rectCollision(rect1, rect2, threshold = 0) {
        return (
            rect1.x < rect2.x + rect2.width - threshold &&
            rect1.x + rect1.width > rect2.x + threshold &&
            rect1.y < rect2.y + rect2.height - threshold &&
            rect1.y + rect1.height > rect2.y + threshold
        );
    }

    circleCollision(rect, circle) {
        const rectCenterX = rect.x + rect.width / 2;
        const rectCenterY = rect.y + rect.height / 2;
        
        const dx = rectCenterX - circle.x;
        const dy = rectCenterY - circle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance < circle.radius + Math.min(rect.width, rect.height) / 2;
    }

    pointInRect(point, rect) {
        return (
            point.x >= rect.x &&
            point.x <= rect.x + rect.width &&
            point.y >= rect.y &&
            point.y <= rect.y + rect.height
        );
    }

    lineIntersectsRect(line, rect) {
        // Check if line intersects with any of the rectangle's edges
        const edges = [
            { x1: rect.x, y1: rect.y, x2: rect.x + rect.width, y2: rect.y },
            { x1: rect.x + rect.width, y1: rect.y, x2: rect.x + rect.width, y2: rect.y + rect.height },
            { x1: rect.x + rect.width, y1: rect.y + rect.height, x2: rect.x, y2: rect.y + rect.height },
            { x1: rect.x, y1: rect.y + rect.height, x2: rect.x, y2: rect.y }
        ];

        for (const edge of edges) {
            if (this.lineIntersectsLine(line, edge)) {
                return true;
            }
        }

        return false;
    }

    lineIntersectsLine(line1, line2) {
        const det = (line1.x2 - line1.x1) * (line2.y2 - line2.y1) - (line2.x2 - line2.x1) * (line1.y2 - line1.y1);
        
        if (det === 0) {
            return false;
        }

        const lambda = ((line2.y2 - line2.y1) * (line2.x2 - line1.x1) + (line2.x1 - line2.x2) * (line2.y2 - line1.y1)) / det;
        const gamma = ((line1.y1 - line1.y2) * (line2.x2 - line1.x1) + (line1.x2 - line1.x1) * (line2.y2 - line1.y1)) / det;

        return (lambda > 0 && lambda < 1) && (gamma > 0 && gamma < 1);
    }
}
