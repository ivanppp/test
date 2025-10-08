import React, { useState, useCallback, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';

interface CardItem {
  id: string;
  title: string;
  description: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CardManagerProps {
  initialCards?: CardItem[];
  onCardCreate?: (card: CardItem) => void;
  onCardUpdate?: (card: CardItem) => void;
  onCardDelete?: (id: string) => void;
}

const CardManager: React.FC<CardManagerProps> = ({
  initialCards = [],
  onCardCreate,
  onCardUpdate,
  onCardDelete,
}) => {
  const [cards, setCards] = useState<CardItem[]>(initialCards);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCard, setNewCard] = useState<Partial<CardItem>>({
    title: '',
    description: '',
    content: '',
  });

  const handleCreateCard = useCallback(() => {
    const card: CardItem = {
      id: Date.now().toString(),
      title: newCard.title || '',
      description: newCard.description || '',
      content: newCard.content || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCards((prev) => [...prev, card]);
    setNewCard({ title: '', description: '', content: '' });
    
    if (onCardCreate) {
      onCardCreate(card);
    }
  }, [newCard, onCardCreate]);

  const handleUpdateCard = useCallback((id: string, updates: Partial<CardItem>) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id
          ? { ...card, ...updates, updatedAt: new Date() }
          : card
      )
    );

    const updatedCard = cards.find((card) => card.id === id);
    if (updatedCard && onCardUpdate) {
      onCardUpdate({ ...updatedCard, ...updates, updatedAt: new Date() });
    }
  }, [cards, onCardUpdate]);

  const handleDeleteCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
    
    if (onCardDelete) {
      onCardDelete(id);
    }
  }, [onCardDelete]);

  const sortedCards = useMemo(() => {
    return [...cards].sort((a, b) => 
      b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }, [cards]);

  return (
    <div className="card-manager">
      <div className="card-manager-header">
        <h1>Card Manager</h1>
        <p>Manage your cards efficiently</p>
      </div>

      <div className="new-card-form">
        <Card>
          <CardHeader>
            <CardTitle>Create New Card</CardTitle>
            <CardDescription>Add a new card to your collection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="form-group">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newCard.title || ''}
                onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                placeholder="Enter card title"
              />
            </div>
            <div className="form-group">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newCard.description || ''}
                onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                placeholder="Enter card description"
              />
            </div>
            <div className="form-group">
              <Label htmlFor="content">Content</Label>
              <Input
                id="content"
                value={newCard.content || ''}
                onChange={(e) => setNewCard({ ...newCard, content: e.target.value })}
                placeholder="Enter card content"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreateCard}>Create Card</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="cards-list">
        {sortedCards.map((card) => (
          <Card key={card.id}>
            <CardHeader>
              <CardTitle>
                {editingId === card.id ? (
                  <Input
                    value={card.title}
                    onChange={(e) => handleUpdateCard(card.id, { title: e.target.value })}
                  />
                ) : (
                  card.title
                )}
              </CardTitle>
              <CardDescription>
                {editingId === card.id ? (
                  <Input
                    value={card.description}
                    onChange={(e) => handleUpdateCard(card.id, { description: e.target.value })}
                  />
                ) : (
                  card.description
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {editingId === card.id ? (
                <Input
                  value={card.content}
                  onChange={(e) => handleUpdateCard(card.id, { content: e.target.value })}
                />
              ) : (
                <p>{card.content}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => setEditingId(editingId === card.id ? null : card.id)}
              >
                {editingId === card.id ? 'Save' : 'Edit'}
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteCard(card.id)}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CardManager;
