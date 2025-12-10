import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "../../components/layout/Layout";
import { Button } from "../../components/common/Button";
import { Loading } from "../../components/common/Loading";
import { productApi } from "../../api";
import {
    ShoppingCart,
    Heart,
    Star,
    Minus,
    Plus,
    ChevronLeft,
    Package,
    Shield,
    Truck
} from "lucide-react";

export const ProductDetailPage = () => {
    const { uuid } = useParams()
    const navigate = useNavigate()

    const [product, setProduct] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        fetchProductDetail();
    }, [uuid])

    const fetchProductDetail = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await productApi.getById(uuid)
            setProduct(response)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price)
    }

    
}