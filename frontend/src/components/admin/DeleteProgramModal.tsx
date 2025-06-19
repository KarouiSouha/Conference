import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash } from "lucide-react";

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, programName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6 bg-white border-2 border-gray-100 shadow-xl rounded-2xl transform transition-all duration-300 scale-100">
        <div className="flex flex-col items-center space-y-6">
          <div className="p-3 bg-red-50 rounded-full">
            <Trash className="w-8 h-8 text-red-600" />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-gray-800">
              Confirmer la suppression
            </h3>
            <p className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer <span className="font-semibold">{programName}</span> ?
              Cette action est irréversible.
            </p>
          </div>

          <div className="flex justify-center space-x-4 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 transition-all duration-200"
            >
              Annuler
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}