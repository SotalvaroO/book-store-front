"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  publicationYear: number
}

export default function Component() {
  const [books, setBooks] = useState<Book[]>([
    {
      id: "1",
      title: "El Quijote",
      author: "Miguel de Cervantes",
      isbn: "978-84-376-0494-7",
      publicationYear: 1605,
    },
    {
      id: "2",
      title: "Cien años de soledad",
      author: "Gabriel García Márquez",
      isbn: "978-84-376-0495-4",
      publicationYear: 1967,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    publicationYear: "",
  })

  const { toast } = useToast()

  // Crear libro
  const createBook = () => {
    if (!formData.title || !formData.author || !formData.isbn || !formData.publicationYear) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      })
      return
    }

    // Verificar que el ISBN no exista
    if (books.some((book) => book.isbn === formData.isbn)) {
      toast({
        title: "Error",
        description: "Ya existe un libro con ese ISBN",
        variant: "destructive",
      })
      return
    }

    const newBook: Book = {
      id: Date.now().toString(),
      title: formData.title,
      author: formData.author,
      isbn: formData.isbn,
      publicationYear: Number.parseInt(formData.publicationYear),
    }

    setBooks([...books, newBook])
    setFormData({ title: "", author: "", isbn: "", publicationYear: "" })
    setIsCreateDialogOpen(false)

    toast({
      title: "Éxito",
      description: "Libro creado correctamente",
    })
  }

  // Buscar por ISBN
  const searchByIsbn = (isbn: string) => {
    return books.filter(
      (book) =>
        book.isbn.toLowerCase().includes(isbn.toLowerCase()) ||
        book.title.toLowerCase().includes(isbn.toLowerCase()) ||
        book.author.toLowerCase().includes(isbn.toLowerCase()),
    )
  }

  // Actualizar libro
  const updateBook = () => {
    if (!editingBook || !formData.title || !formData.author || !formData.isbn || !formData.publicationYear) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      })
      return
    }

    // Verificar que el ISBN no exista en otro libro
    if (books.some((book) => book.isbn === formData.isbn && book.id !== editingBook.id)) {
      toast({
        title: "Error",
        description: "Ya existe otro libro con ese ISBN",
        variant: "destructive",
      })
      return
    }

    setBooks(
      books.map((book) =>
        book.id === editingBook.id
          ? {
              ...book,
              title: formData.title,
              author: formData.author,
              isbn: formData.isbn,
              publicationYear: Number.parseInt(formData.publicationYear),
            }
          : book,
      ),
    )

    setFormData({ title: "", author: "", isbn: "", publicationYear: "" })
    setEditingBook(null)
    setIsEditDialogOpen(false)

    toast({
      title: "Éxito",
      description: "Libro actualizado correctamente",
    })
  }

  // Eliminar libro
  const deleteBook = (isbn: string) => {
    setBooks(books.filter((book) => book.isbn !== isbn))
    toast({
      title: "Éxito",
      description: "Libro eliminado correctamente",
    })
  }

  // Abrir diálogo de edición
  const openEditDialog = (book: Book) => {
    setEditingBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publicationYear: book.publicationYear.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const filteredBooks = searchTerm ? searchByIsbn(searchTerm) : books

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center gap-2 mb-8">
        <BookOpen className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Gestión de Libros</h1>
      </div>

      {/* Barra de búsqueda y botón crear */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por ISBN, título o autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Crear Libro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Libro</DialogTitle>
              <DialogDescription>Completa todos los campos para crear un nuevo libro.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título del libro"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Nombre del autor"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  placeholder="978-84-376-0494-7"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="year">Año de Publicación</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.publicationYear}
                  onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })}
                  placeholder="2024"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={createBook}>Crear Libro</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Libros</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{books.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resultados de Búsqueda</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredBooks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Año Más Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {books.length > 0 ? Math.max(...books.map((b) => b.publicationYear)) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de libros */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Libros</CardTitle>
          <CardDescription>
            {searchTerm
              ? `Mostrando ${filteredBooks.length} resultados para "${searchTerm}"`
              : `${books.length} libros en total`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBooks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "No se encontraron libros que coincidan con la búsqueda" : "No hay libros registrados"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Año</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{book.isbn}</Badge>
                    </TableCell>
                    <TableCell>{book.publicationYear}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(book)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteBook(book.isbn)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Libro</DialogTitle>
            <DialogDescription>Modifica los campos que desees actualizar.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título del libro"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-author">Autor</Label>
              <Input
                id="edit-author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Nombre del autor"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-isbn">ISBN</Label>
              <Input
                id="edit-isbn"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="978-84-376-0494-7"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-year">Año de Publicación</Label>
              <Input
                id="edit-year"
                type="number"
                value={formData.publicationYear}
                onChange={(e) => setFormData({ ...formData, publicationYear: e.target.value })}
                placeholder="2024"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={updateBook}>Actualizar Libro</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
