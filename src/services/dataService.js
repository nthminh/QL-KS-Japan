import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Collection names
const ENGINEERS_COLLECTION = 'engineers';
const INVOICES_COLLECTION = 'invoices';
const TRANSFER_HISTORY_COLLECTION = 'transferHistory';
const COMPANIES_COLLECTION = 'companies';

// Engineer operations
export const engineerService = {
  // Add a new engineer
  async addEngineer(engineerData) {
    try {
      const docRef = await addDoc(collection(db, ENGINEERS_COLLECTION), {
        ...engineerData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, success: true };
    } catch (error) {
      console.error('Error adding engineer:', error);
      throw error;
    }
  },

  // Get all engineers
  async getAllEngineers() {
    try {
      const q = query(collection(db, ENGINEERS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting engineers:', error);
      throw error;
    }
  },

  // Update an engineer
  async updateEngineer(id, engineerData) {
    try {
      const engineerRef = doc(db, ENGINEERS_COLLECTION, id);
      await updateDoc(engineerRef, {
        ...engineerData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating engineer:', error);
      throw error;
    }
  },

  // Delete an engineer
  async deleteEngineer(id) {
    try {
      await deleteDoc(doc(db, ENGINEERS_COLLECTION, id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting engineer:', error);
      throw error;
    }
  }
};

// Invoice operations
export const invoiceService = {
  // Add a new invoice
  async addInvoice(invoiceData) {
    try {
      const docRef = await addDoc(collection(db, INVOICES_COLLECTION), {
        ...invoiceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, success: true };
    } catch (error) {
      console.error('Error adding invoice:', error);
      throw error;
    }
  },

  // Get all invoices
  async getAllInvoices() {
    try {
      const q = query(collection(db, INVOICES_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting invoices:', error);
      throw error;
    }
  },

  // Update an invoice
  async updateInvoice(id, invoiceData) {
    try {
      const invoiceRef = doc(db, INVOICES_COLLECTION, id);
      await updateDoc(invoiceRef, {
        ...invoiceData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  },

  // Delete an invoice
  async deleteInvoice(id) {
    try {
      await deleteDoc(doc(db, INVOICES_COLLECTION, id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  }
};

// Transfer History operations
export const transferHistoryService = {
  // Add a transfer record
  async addTransfer(transferData) {
    try {
      const docRef = await addDoc(collection(db, TRANSFER_HISTORY_COLLECTION), {
        ...transferData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, success: true };
    } catch (error) {
      console.error('Error adding transfer:', error);
      throw error;
    }
  },

  // Get transfer history for an engineer
  async getTransfersByEngineerId(engineerId) {
    try {
      const q = query(
        collection(db, TRANSFER_HISTORY_COLLECTION),
        where('engineerId', '==', engineerId),
        orderBy('transferDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting transfers:', error);
      throw error;
    }
  },

  // Get all transfer history
  async getAllTransfers() {
    try {
      const q = query(collection(db, TRANSFER_HISTORY_COLLECTION), orderBy('transferDate', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting all transfers:', error);
      throw error;
    }
  },

  // Update a transfer record
  async updateTransfer(id, transferData) {
    try {
      const transferRef = doc(db, TRANSFER_HISTORY_COLLECTION, id);
      await updateDoc(transferRef, {
        ...transferData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating transfer:', error);
      throw error;
    }
  },

  // Delete a transfer record
  async deleteTransfer(id) {
    try {
      await deleteDoc(doc(db, TRANSFER_HISTORY_COLLECTION, id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting transfer:', error);
      throw error;
    }
  }
};

// Company operations
export const companyService = {
  // Add a new company
  async addCompany(companyData) {
    try {
      const docRef = await addDoc(collection(db, COMPANIES_COLLECTION), {
        ...companyData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, success: true };
    } catch (error) {
      console.error('Error adding company:', error);
      throw error;
    }
  },

  // Get all companies
  async getAllCompanies() {
    try {
      const q = query(collection(db, COMPANIES_COLLECTION), orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting companies:', error);
      throw error;
    }
  },

  // Update a company
  async updateCompany(id, companyData) {
    try {
      const companyRef = doc(db, COMPANIES_COLLECTION, id);
      await updateDoc(companyRef, {
        ...companyData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating company:', error);
      throw error;
    }
  },

  // Delete a company
  async deleteCompany(id) {
    try {
      await deleteDoc(doc(db, COMPANIES_COLLECTION, id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  }
};
