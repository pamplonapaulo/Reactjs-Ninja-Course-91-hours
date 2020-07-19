import { useEffect, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { db } from 'services/firebase'
import { useMounted } from 'hooks'

function useCollection (collection) {
  const [data, setData] = useState(null)
  const { pathname } = useLocation()
  const mounted = useMounted()

  const fetchCollectionData = useCallback(() => {
    db.collection(collection).get().then(querySnapshot => {
      const docs = []

      querySnapshot.forEach(doc => {
        docs.push({
          id: doc.id,
          ...doc.data()
        })
      })

      if (mounted.current) {
        setData(docs)
      }
    })
  }, [collection, mounted])

  const add = useCallback((data) => {
    console.log('data add new', data)
    return db.collection(collection).add(data)
  }, [collection])

  const edit = useCallback((id, data) => {
    console.log('edit size', data, id)
    return db.collection(collection).doc(id).set(data)
  }, [collection])

  const remove = useCallback(async (id) => {
    await db.collection(collection).doc(id).delete()
    fetchCollectionData()
  }, [collection, fetchCollectionData])

  const removePizzaSize = useCallback(async (id) => {
    const pizzaSizeRef = db.collection('pizzasSizes').doc(id)

    db.runTransaction(async (transaction) => {
      const sizeDoc = await transaction.get(pizzaSizeRef)
      if (!sizeDoc.exists) {
        throw new Error('')
      }
      transaction.delete(pizzaSizeRef)

      const allFlavours = await db.collection('pizzasFlavours').get()

      allFlavours.forEach(flavour => {
        const { [id]: sizeId, ...value } = flavour.data().value
        const flavourRef = db.collection('pizzasFlavours').doc(flavour.id)
        transaction.update(flavourRef, { value })
      })
    })
      .then(() => {
        console.log('Transaction accomplished sucessfully!')
        fetchCollectionData()
      })
      .catch((e) => console.log('Transaction error:', e))
  }, [fetchCollectionData])

  useEffect(() => {
    fetchCollectionData()
  }, [pathname, fetchCollectionData])

  return { data, add, edit, remove, removePizzaSize }
}

export default useCollection
