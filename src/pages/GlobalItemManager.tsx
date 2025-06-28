import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import supabase from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import { Trash2, Pencil } from "lucide-react";
import ImageSelectorModal from "@/modals/ImageSelectorModal";
import Modal from "@/components/ui/Modal";


interface GiftItem {
  id: string;
  name: string;
  image_url?: string;
  description?: string;
}

export default function GlobalItemManager() {
  const [items, setItems] = useState<GiftItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<GiftItem>>({});
  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GiftItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  const fetchItems = async () => {
    const { data } = await supabase.from("gift_items").select("*").order("name", { ascending: true });
    setItems(data || []);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async () => {
    if (!newItem.name) {
      toast("기념품 이름을 입력해주세요.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("gift_items").insert([{
      name: newItem.name,
      description: newItem.description,
      image_url: newItem.image_url,
    }]);

    if (error) {
      toast("추가 실패: " + error.message);
    } else {
      setNewItem({});
      fetchItems();
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const { error } = await supabase.from("gift_items").delete().eq("id", id);
    if (error) {
      toast("삭제 실패: " + error.message);
    } else {
      fetchItems();
    }
  };

  const handleEditSave = async () => {
    if (!editingItem) return;

    const { error } = await supabase
      .from("gift_items")
      .update({
        name: editingItem.name,
        description: editingItem.description,
        image_url: editingItem.image_url,
      })
      .eq("id", editingItem.id);

    if (error) {
      toast("수정 실패: " + error.message);
    } else {
      setShowEditModal(false);
      setEditingItem(null);
      fetchItems();
    }
  };

  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* ➕ 새 기념품 추가 */}
      <div className="border rounded p-4 shadow bg-white space-y-3">
        <h3 className="font-semibold text-lg">기념품 항목 추가</h3>

        <label className="block space-y-1" htmlFor="new-item-name">
          <span className="sr-only">기념품 이름</span>
          <Input
            id="new-item-name"
            placeholder="기념품 이름"
            value={newItem.name ?? ""}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </label>

        <Textarea
          placeholder="기념품 설명 (선택)"
          value={newItem.description ?? ""}
          onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
        />

        <div className="space-y-2">
          <Button variant="outline" onClick={() => setShowImageModal(true)}>
            이미지 선택
          </Button>

          {newItem.image_url && (
            <img
              src={newItem.image_url}
              alt="선택된 이미지"
              className="w-32 h-20 object-contain border rounded"
            />
          )}
        </div>

        <Button onClick={handleAdd} disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader className="h-4 w-4" /> 추가 중...
            </span>
          ) : (
            "기념품 추가"
          )}
        </Button>
      </div>

      {/* 📋 현재 항목 목록 */}
      <div>
        <h3 className="font-semibold mb-3">기존 기념품 목록 ({items.length})</h3>
        <Input
          placeholder="검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-3"
        />
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between border rounded px-4 py-2 bg-white shadow-sm w-full"
            >
              <div className="flex items-center gap-3">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-14 h-14 object-contain rounded border"
                  />
                )}
                <div className="flex flex-col">
                  <span className="font-medium">{item.name}</span>
                  {item.description && (
                    <span className="text-sm text-redCrossWarmGray-500">{item.description}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditingItem(item);
                    setShowEditModal(true);
                  }}
                  aria-label="편집"
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(item.id)}
                  className="text-redCrossRed"
                  aria-label="삭제"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 이미지 선택 모달 (추가용) */}
      {showImageModal && (
        <ImageSelectorModal
          onSelect={(url) => {
            setNewItem((prev) => ({ ...prev, image_url: url }));
            setShowImageModal(false);
          }}
          onClose={() => setShowImageModal(false)}
        />
      )}

      {/* 수정용 모달 */}
      {showEditModal && editingItem && (
        <Modal
          onClose={() => setShowEditModal(false)}
          labelledBy="edit-item-modal-title"
          maxWidthClass="max-w-[95vw] sm:max-w-xl md:max-w-3xl"
        >
          <h3 id="edit-item-modal-title" className="text-lg font-semibold mb-4">
            기념품 편집
          </h3>

          <label className="block space-y-1" htmlFor="edit-item-name">
            <span className="sr-only">이름</span>
            <Input
              id="edit-item-name"
              value={editingItem.name}
              onChange={(e) =>
                setEditingItem({ ...editingItem, name: e.target.value })
              }
              placeholder="이름"
            />
          </label>

          <Textarea
            value={editingItem.description ?? ""}
            onChange={(e) =>
              setEditingItem({ ...editingItem, description: e.target.value })
            }
            placeholder="설명"
            className="mt-2"
          />

          <div className="my-2 space-y-2">
            <Button variant="outline" onClick={() => setShowImageModal(true)}>
              이미지 선택
            </Button>
            {editingItem.image_url && (
              <img
                src={editingItem.image_url}
                className="w-32 h-20 object-contain border rounded"
              />
            )}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowEditModal(false)}>
              취소
            </Button>
            <Button onClick={handleEditSave}>저장</Button>
          </div>

          {/* 이미지 선택 모달 (편집용) */}
          {showImageModal && (
            <ImageSelectorModal
              onSelect={(url) => {
                setEditingItem((prev) => (prev ? { ...prev, image_url: url } : null));
                setShowImageModal(false);
              }}
              onClose={() => setShowImageModal(false)}
            />
          )}
        </Modal>
      )}
    </div>
  );
}

