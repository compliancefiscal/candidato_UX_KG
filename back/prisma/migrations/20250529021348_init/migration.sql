-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "neighborhood" TEXT,
    "zip_code" TEXT,
    "phone" TEXT,
    "salary" DECIMAL(10,2) NOT NULL,
    "contract_date" TIMESTAMP(3) NOT NULL,
    "function" TEXT NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);
