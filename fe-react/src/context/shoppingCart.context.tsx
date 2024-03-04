import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import ShoppingCart from "../components/ModalShoppingCart";
import { getUserFromCookie } from "../helper/useCookie";
import { getCookie } from "../helper/CookiesRequest";
import {
  CustomError,
  IDetailProductCart,
  IInfoAccount,
} from "../types/product.type";
import axios from "axios";
import API from "../api";
import { toast } from "react-toastify";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type CartItem = {
  id: number;
  quantity: number;
};

interface User {
  id: string;
  email: string;
  role: string;
  fullName: string;
  avata: string;
  expirationTime: Date;
}

type ShoppingCartContext = {
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  addMultipleToCart: (id: number, quantityToAdd: number) => void;
  cartQuantity: number;
  cartQuantityUser: number;
  cartItems: CartItem[];
  loading: boolean;
  setLoading: (isLoading: boolean) => void;
  userPrf: User | null;
  addToCartUser: (idDetailShoe: number, quantity: number) => void;
  listProducts: IDetailProductCart[];
  reduceShoe: (id: number, quantity: number) => void;
  addShoe: (id: number, quantity: number) => void;
  removeFromCartUser: (id: number) => void;
  getProductQuantityById: (id: number) => number;
  removeAllCart: () => void;
  infoUser: IInfoAccount | undefined;
  getItemQuantityUser: (id: number) => number;
  removeAllCartKH: () => void;
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}
export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [listProducts, setListProducts] = useState<IDetailProductCart[]>([]);
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "shopping-cart",
    []
  );
  const [infoUser, setInfoUser] = useState<IInfoAccount>();
  const token = getCookie("customerToken");
  const [userPrf, setUserPrf] = useState<User | null>(null);
  const getListDetailCart = async () => {
    try {
      const res = await axios({
        method: "get",
        url: API.getListDetailCart(Number(userPrf?.id)),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status) {
        setListProducts(res?.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const loadInfoUser = async () => {
    try {
      const res = await axios({
        method: "get",
        url: API.getInfoUser(Number(userPrf?.id)),
      });

      if (res.data) {
        setInfoUser(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const reduceShoe = async (idShoeDetail: number, quantity: number) => {
    try {
      const res = await axios({
        method: "put",
        url: API.updateAmountShoe(),
        data: {
          quantity: quantity - 1,
          id: idShoeDetail,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status) {
      }
    } catch (error) {
      if (typeof error === "string") {
        toast.error(error);
      } else if (error instanceof Error) {
        const customError = error as CustomError;
        if (customError.response && customError.response.data) {
          toast.error(customError.response.data);
        } else {
          toast.error(customError.message);
        }
      } else {
        toast.error("Hãy thử lại.");
      }
    } finally {
      getListDetailCart();
    }
  };
  const addShoe = async (idShoeDetail: number, quantity: number) => {
    try {
      const res = await axios({
        method: "put",
        url: API.updateAmountShoe(),
        data: {
          quantity: quantity + 1,
          id: idShoeDetail,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status) {
        console.log(res);
      }
    } catch (error) {
      if (typeof error === "string") {
        toast.error(error);
      } else if (error instanceof Error) {
        const customError = error as CustomError;
        if (customError.response && customError.response.data) {
          toast.error(customError.response.data);
        } else {
          toast.error(customError.message);
        }
      } else {
        toast.error("Hãy thử lại.");
      }
    } finally {
      getListDetailCart();
    }
  };
  const addToCartUser = async (idDetailShoe: number, quantity: number) => {
    if (userPrf) {
      try {
        const res = await axios({
          method: "post",
          url: API.addToCart(),
          data: {
            id: userPrf.id,
            quantity: quantity,
            shoeDetail: idDetailShoe,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status) {
          toast.success("Thêm thành công");
        } else {
          return;
        }
      } catch (error) {
        if (typeof error === "string") {
          // Nếu error là một chuỗi, giả sử đó là một thông báo lỗi từ server
          toast.error(error);
        } else if (error instanceof Error) {
          // Nếu error là một đối tượng Error và có response
          const customError = error as CustomError;
          if (customError.response && customError.response.data) {
            toast.error(customError.response.data);
          } else {
            toast.error(customError.message);
          }
        } else {
          // Trường hợp khác, hiển thị một thông báo mặc định
          toast.error("Thất bại. Vui lòng thử lại sau.");
        }
      } finally {
        getListDetailCart();
      }
    }
  };
  const removeFromCartUser = async (idDetailCart: number) => {
    try {
      const res = await axios({
        method: "delete",
        url: API.removeFromCart(idDetailCart),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status) {
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng thành công");
      }
    } catch (error) {
    } finally {
      getListDetailCart();
    }
  };

  const removeAllCart = async () => {
    try {
      const res = await axios({
        method: "delete",
        url: API.removeAll(Number(userPrf?.id)),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status) {
        // toast.success("Xóa sản phẩm trong giỏ hàng thành công");
      }
    } catch (error) {
      console.log(error);
    } finally {
      getListDetailCart();
    }
  };
  const removeAllCartKH = () => {
    setCartItems([]);
  };
  const getProductQuantityById = (productId: number) => {
    const product = listProducts.find(
      (product) => product?.idProductDetail === productId
    );
    return product ? product?.quantity : 0;
  };
  const cartQuantityUser = listProducts.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  useEffect(() => {
    if (userPrf) {
      loadInfoUser();
    }
  }, [userPrf]);
  useEffect(() => {
    const userFromCookie = getUserFromCookie();
    if (
      userFromCookie &&
      JSON.stringify(userFromCookie) !== JSON.stringify(userPrf)
    ) {
      setUserPrf(userFromCookie);
    }
  }, [userPrf]);
  useEffect(() => {
    if (!!userPrf?.id && !!token) {
      getListDetailCart();
    }
  }, [userPrf?.id, token]);
  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  //  Khách vãng lãi
  // Lấy số lượng sản phẩm
  function getItemQuantity(id: number) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }
  function getItemQuantityUser(id: number) {
    return (
      listProducts.find((item) => item.idProductDetail === id)?.quantity || 0
    );
  }
  // tăng số lượng
  function increaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }
  // giảm số lượng
  function decreaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }
  function clearCart() {
    setCartItems([]);
  }
  function removeFromCart(id: number) {
    setCartItems((currItems) => {
      return currItems.filter((item) => item.id !== id);
    });
    toast.success("đã xóa thành công");
  }
  function addMultipleToCart(id: number, quantityToAdd: number) {
    setCartItems((currItems) => {
      const updatedItems = [...currItems]; // Tạo một bản sao của mảng hiện tại

      const itemIndex = updatedItems.findIndex((item) => item.id === id);

      if (itemIndex !== -1) {
        // Sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng đúng
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: updatedItems[itemIndex].quantity + quantityToAdd,
        };
      } else {
        // Sản phẩm chưa tồn tại trong giỏ hàng, thêm vào giỏ hàng
        updatedItems.push({ id, quantity: quantityToAdd });
      }

      return updatedItems;
    });
  }
  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        addMultipleToCart,
        openCart,
        closeCart,
        cartItems,
        cartQuantity,
        cartQuantityUser,
        clearCart,
        loading,
        setLoading,
        userPrf,
        listProducts,
        addToCartUser,
        reduceShoe,
        addShoe,
        removeFromCartUser,
        getProductQuantityById,
        removeAllCart,
        infoUser,
        getItemQuantityUser,
        removeAllCartKH,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
}
