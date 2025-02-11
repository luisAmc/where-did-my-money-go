import { Button } from '../shared/Button';
import { Card } from '../shared/Card';
import { CategoryList } from './CategoryList';
import { NewCategoryDrawer } from './NewCategoryDrawer';

export function Categories() {
    return (
        <Card className="mt-4">
            <h2 className="text-lg font-medium">Categorias</h2>
            <CategoryList />
            <NewCategoryDrawer />

            <Button href="/">Inicio</Button>
        </Card>
    );
}
